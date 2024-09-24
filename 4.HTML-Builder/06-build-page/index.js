const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const sourceAssets = path.join(__dirname, 'assets');
const sourceStyles = path.join(__dirname, 'styles');
const sourceComponents = path.join(__dirname, 'components');
const sourceTemplate = path.join(__dirname, 'template.html');

const dist = path.join(__dirname, 'project-dist');
const distAssets = path.join(dist, 'assets');
const distStyle = path.join(dist, 'style.css');
const distIndexHTML = path.join(dist, 'index.html');

async function buildProject() {
  await fs.promises.rm(dist, { force: true, recursive: true });
  await fs.promises.mkdir(dist, { recursive: true });

  await buildHTML(sourceTemplate, sourceComponents, distIndexHTML);
  await mergeStyles(sourceStyles, distStyle);
  await copyDir(sourceAssets, distAssets);
}

buildProject();

async function buildHTML(sourceTemplate, sourceComponents, distIndexHTML) {
  // создаем копию шаблона из template.html в project-dist/index.html
  const templateContent = await fs.promises.readFile(sourceTemplate, 'utf-8');
  await fs.promises.writeFile(distIndexHTML, templateContent);

  // получаем содержимое копии шаблона (разметку)
  let htmlContent = await fs.promises.readFile(distIndexHTML, 'utf-8');

  // получаем файлы из папки components в виде объектов
  const components = await fs.promises.readdir(sourceComponents, {
    withFileTypes: true,
  });

  // заменяем шаблоны на соответствующую разметку из components
  const htmlMarkup = await replaceTemplates(
    htmlContent,
    components,
    sourceComponents,
  );
  await fs.promises.writeFile(distIndexHTML, htmlMarkup);
}

async function replaceTemplates(htmlContent, components, sourceComponents) {
  for (const component of components) {
    const componentPath = path.join(sourceComponents, component.name);

    const itHTML =
      component.isFile() && path.extname(componentPath) === '.html';

    if (itHTML) {
      const componentName = path.basename(componentPath, '.html');
      const componentMarkup = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      const template = `{{${componentName}}}`;
      if (htmlContent.includes(template)) {
        htmlContent = htmlContent.replace(template, componentMarkup);
      }
    }
  }
  return htmlContent;
}

async function copyDir(source, dist) {
  await fs.promises.mkdir(dist, { recursive: true });

  const sourceContents = await fs.promises.readdir(source, {
    withFileTypes: true,
  });

  const copyPromises = sourceContents.map(async (entry) => {
    const entrySource = path.join(source, entry.name);
    const entryDist = path.join(dist, entry.name);

    if (entry.isDirectory()) {
      await copyDir(entrySource, entryDist);
    } else {
      const readStream = fs.createReadStream(entrySource);
      const writeStream = fs.createWriteStream(entryDist);

      await new Promise((resolve, reject) => {
        pipeline(readStream, writeStream, (err) => {
          err ? reject(err) : writeStream.on('finish', resolve);
        });
      });
    }
  });
  await Promise.allSettled(copyPromises);
}

async function mergeStyles(sourcePath, targetPath) {
  const source = await fs.promises.readdir(sourcePath);
  const writeStream = fs.createWriteStream(targetPath);

  let firstFile = true;

  for (const file of source) {
    const componentPath = path.join(sourcePath, file);
    const isCSS = path.extname(componentPath) === '.css';

    if (isCSS) {
      const data = await fs.promises.readFile(componentPath, 'utf-8');

      if (!firstFile) {
        writeStream.write('\n');
      }

      writeStream.write(data);
      firstFile = false;
    }
  }
  writeStream.end();
}
