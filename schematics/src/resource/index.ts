import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';

interface ResourceSchema {
  name: string;
}

export function resource(options: ResourceSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    if (!/^[a-z][a-z0-9-]*$/.test(options.name)) {
      throw new SchematicsException(
        `Resource name must be lowercase kebab-case (e.g. product, blog-post). Got: "${options.name}"`,
      );
    }

    const templateSource = apply(url('./files'), [
      template({ ...strings, ...options }),
      move(`src/modules/${strings.dasherize(options.name)}`),
    ]);

    return chain([mergeWith(templateSource, MergeStrategy.Error)]);
  };
}
