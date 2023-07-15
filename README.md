# 💬 RVT - CLI Reference

``rvt-cli`` lib was developed by me specially for [react-vite-template](https://github.com/XenoPOMP/react-vite-template).

For full help, execute this command:
```shell
rvt --help
```

## Configuration
```tsx
interface Configuration {
  componentGeneration?: {
    createScssModule?: boolean;
    createPropInterface?: boolean;
  };
}
```

## New

This command allows you to generate new entities inside project.

Syntax:

```yarn
rvt new <TYPE> <NAME> 
```

### Arguments
* TYPE - 'component' | 'ui'
* NAME - string


## Init

This command allows you to initialize special types of projects (like Chrome extension) based from your current project.

```yarn
rvt init <ENTITY>
```
### Arguments
* ENTITY - 'chrome-extension'

