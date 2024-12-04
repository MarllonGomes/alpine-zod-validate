# Alpine.js Zod Validation

Is an integration between [Alpine.js](https://www.npmjs.com/package/alpinejs) and [Zod](https://www.npmjs.com/package/zod) for form validation. 
This library allows you to define validation schemas using Zod and apply them directly in your Alpine.js components with ease.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)


## Installation


#### As a npm module + bundler

Install the package via npm:
```bash
$ npm i @mfgomess/alpine-zod-validation
```

Import the package in your project and start using it:
```javascript
import Alpine from 'alpinejs';
import {zValidation} from 'alpine-zod-validation';

window.Alpine = Alpine;
Alpine.plugin(zValidation);
Alpine.start();
```

#### Use it from CDN

```bash
<script type="module" defer src="https://unpkg.com/@mfgomess/alpine-zod-validation/dist/cdn.js" />
<script src="//unpkg.com/alpinejs" defer></script>
```

## Usage

To use validation you should apply the 'x-zvalidate' directive to your alpinejs component, and define a 'zValidateSchema' property with your Zod schema, then you can use the $zValidation magic method to check if the form is valid or not.

```html
<form
    @submit.prevent="save"
    x-zvalidate
    x-data="{
        name: '',
        zValidateSchema: $z.object({ 
            name: $z.string().min(3), 
            email: $z.string().email() 
        }),
        save() {
            if($zValidation.validate()) {
                console.log('Form is valid');
            }
        }
    }"        
>
    <input 
        type="text" 
        x-model="name"
        x-bind:class="{ 
            'errored': $zValidation.isInvalid('name'), 
            'success': $zValidation.isValid('name') 
        }"
    />
    <span x-show="$zValidation.isInvalid('name')" x-text="$zValidation.getError('name')"></span>
    <button type="submit">Submit</button>
</form>
```

## Features

### On-event validation
You can pass any input event to the x-validate directive, it will react to the x-model that dispatched that event and validate the input right after
```html
<form 
    x-zvalidate="input" 
    x-data="{ name: '', zValidateSchema: $z.object({ name: $z.string().min(3) }) }"
>
    <input type="text" x-model="name" />
    <span x-show="$zValidation.isInvalid('name')" x-text="$zValidation.getError('name')"></span>
</form>
```

### $z magic method

The $z magic method is just a shortcut to the Zod object, you can use it to define your validation schema in a more readable way.

[Check Zod documentation](https://www.npmjs.com/package/zod) for more information about Zod.

```html
<form 
    x-zvalidate 
    x-data="{  
        zValidateSchema: $z.object({ 
            name: $z.string().min(3), 
            email: $z.string().email() 
        }) 
    }"
>
```


### $zValidation magic method

The $zValidation magic method provides some useful methods to check the form validation status, like:

| Method                        | Return Type      | Description                                                                                       |
|-------------------------------|------------------|---------------------------------------------------------------------------------------------------|
| $zValidation.validate()       | bool             | Checks if the form is valid or not, returns a boolean.                                            |
| $zValidation.isInvalid(field) | boolean          | Checks if a specific field is invalid, returns a boolean.                                         |
| $zValidation.isValid(field)   | boolean          | Checks if a specific field is valid, returns a boolean. (Triggered only after the field is dirty) |
| $zValidation.getError(field)  | ?string          | Gets the error message of a specific field, returns a string.                                     |
| $zValidation.getErrors()      | {field: 'error'} | Gets all error messages, returns an object.                                                       |
| $zValidation.reset()          | void             | Resets the form validation state.                                                                 |

```html
<form 
    x-zvalidate 
    x-data="{ 
        name: '', 
        zValidateSchema: $z.object({ name: $z.string().min(3) }),
        onSave() {
            if($zValidation.validate()) {
                console.log('Form is valid');
                return;
            }
            
            console.log('Form is invalid');
            console.log($zValidation.getErrors());
        } 
    }"
>
    <input 
        type="text" 
        x-model="name"
        x-bind:class="{ 
            'errored': $zValidation.isInvalid('name'), 
            'success': $zValidation.isValid('name') 
        }"
    />
    <span 
        x-show="$zValidation.isInvalid('name')" 
        x-text="$zValidation.getError('name')"
    ></span>
    
    <button @click="onSave">Validate</button>    
    <button @click="$zValidation.reset()">Reset</button>
</form>
```


## Contributing

Contributions, issues, and feature requests are welcome.

## License

MIT


