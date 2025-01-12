import * as d from '../../declarations';


export async function getClientPolyfill(config: d.Config, compilerCtx: d.CompilerCtx, polyfillFile: string) {
  const polyfillFilePath = config.sys.path.join(
    config.sys.compiler.packageDir, 'internal', 'client', 'polyfills', polyfillFile
  );
  return compilerCtx.fs.readFile(polyfillFilePath);
}

export async function getAppBrowserCorePolyfills(config: d.Config, compilerCtx: d.CompilerCtx) {
  // read all the polyfill content, in this particular order
  const polyfills = INLINE_POLYFILLS.slice();

  if (config.extras.cssVarsShim) {
    polyfills.push(INLINE_CSS_SHIM)
  }

  const results = await Promise.all(
    polyfills
      .map(polyfillFile => getClientPolyfill(config, compilerCtx, polyfillFile))
  );

  // concat the polyfills
  return results.join('\n').trim();
}


// order of the polyfills matters!! test test test
// actual source of the polyfills are found in /src/client/polyfills/
const INLINE_POLYFILLS = [
  'promise.js',
  'core-js.js',
  'dom.js',
  'es5-html-element.js',
  'system.js',
];

const INLINE_CSS_SHIM = 'css-shim.js';