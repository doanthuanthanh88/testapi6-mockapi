[testapi6-mockapi](../README.md) / [Exports](../modules.md) / MockApi

# Class: MockApi

Create a mock API service

```yaml
- MockApi:
    title: Start mock server
    port: 443
    host: 0.0.0.0
    https: true
    # https:
    #   key: https key string
    #   cert: https cert string
    routers:
      - root: assets
      - method: GET
        path: /test/:name
        data: [
          { name: 1 },
          { name: 2 }
        ] 
```

## Hierarchy

* *Tag*

  ↳ **MockApi**

## Table of contents

### Constructors

- [constructor](mockapi.md#constructor)

### Properties

- [host](mockapi.md#host)
- [https](mockapi.md#https)
- [port](mockapi.md#port)
- [routers](mockapi.md#routers)

## Constructors

### constructor

\+ **new MockApi**(`attrs`: [*MockApi*](mockapi.md)): [*MockApi*](mockapi.md)

#### Parameters:

Name | Type |
:------ | :------ |
`attrs` | [*MockApi*](mockapi.md) |

**Returns:** [*MockApi*](mockapi.md)

Overrides: void

## Properties

### host

• `Optional` **host**: *string*

Server address

___

### https

• `Optional` **https**: *boolean* \| { `cert`: *string* ; `key`: *string*  }

Server scheme

___

### port

• `Optional` **port**: *number*

Server port

___

### routers

• **routers**: { `root`: *string*  }[] \| { `data?`: *any* ; `headers?`: *any* ; `method`: *string* \| *string*[] ; `path`: *string* ; `status?`: *number* ; `statusText?`: *string*  }[]

Define routers
