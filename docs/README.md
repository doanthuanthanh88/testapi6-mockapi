testapi6-mockapi / [Exports](modules.md)

# testapi6-redis
Execute redis command

# Features
- Exec redis command

> Read [document details](./docs/modules.md)

# How to use
### Installation
```javascript
// install via npm
npm install -g testapi6-redis

// install via yarn
yarn global add testapi6-redis
```

### Use in yaml
```yaml
- Require:
    root: path_to_this_modules
    modules:
      - testapi6-redis/dist/index.js
- Redis:
    connection: redis://localhost:6379
    commands: 
      - title: Get users
        command: 
          - get
          - users
        var: rs
```
