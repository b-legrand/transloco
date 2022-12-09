import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '../utils/create-workspace';
import { SchemaOptions } from '../ng-add/schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng add', () => {
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;
  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });
  it('should add transloco to specified project', async () => {
    const options: SchemaOptions = { project: 'bar' } as SchemaOptions;
    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    expect(tree).toBeDefined();
    expect(tree.files).toContain('/transloco.config.js');
    expect(tree.files).toContain('/projects/bar/src/app/transloco-root.module.ts');
  });
});
