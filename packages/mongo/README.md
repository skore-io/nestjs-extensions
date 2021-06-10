# `@skore-io/mongo`

## Ensure mongodb index through decorators and manages mongodb connections

### Using the EnsureIndex

Just annotate the class with @EnsureIndex()

```typescript
@EnsureIndex({
  connectionName: 'SameNameDefinedAtMongoModuleImport' //optional
  collection: 'test',
  ensureIndexOptions: [{ name: 'my_cool_index', key: { public: 1 } }],
})
@Injectable()
export class TestDocument {}
```

It will create an ascending index with the name `my_cool_index` with the key: `public` on the collection `test`.
