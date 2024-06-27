# RailsToastify

**Rails Toastify** allows you to easily add notifications to your app. Please note: this gem is still under development. Please CONTRIBUTE.

The **Rails Toastify** gem is completely inspired by the [React Toastify](https://fkhadra.github.io/react-toastify/introduction/) lib and is specially made for those React developers who are migrating to Rails thanks to Hotwire or for any other reason, and who love using Toasts and wanted a gem that makes it as easy as it is in React. 🎉 

## Installation

Add gem in your Gemfile:
```ruby
gem 'rails_toastify'
```
and run **bundle install**

After run:

```sh
rails generate rails_toastify:install
```

This will create a file *config/initializers/rails_toastify.rb* where you can define the framework you want to use:

```ruby
RailsToastify.configure do |config|
  config.framework = :tailwind # or :bootstrap
end
```

## Usage

In your *application.html.erb* add:

```ruby
<%= stylesheet_link_tag 'rails_toastify', media: 'all' %>
<%= javascript_include_tag 'rails_toastify' %>
```
And:

```html
<div id="toast-container" class="toast-container"></div>
```

In your *config/manifest.js* add:

```js
//= link rails_toastify.css
//= link rails_toastify.js
```

And call function `RailsToastify.showToast` any javascript:

```ruby
RailsToastify.showToast('This is a success message!', 'success');
RailsToastify.showToast('This is an error message!', 'error');
RailsToastify.showToast('This is an info message!', 'info');
RailsToastify.showToast('This is a warning message!', 'warning');
```

To see notice in a toast add:

```ruby 
<%= javascript_tag do %>
  RailsToastify.showToast('<%= notice %>', 'success')
<% end %>
```

## Requirements

- Ruby >= 2.6.0 (recommended 2.7+)  
- Rails >= 6.0 (compatible up to Rails 7)
  
## Contributing to Rails Toastify

Fork, fix, then send a pull request. Bug reports and pull requests are welcome on GitHub at **https://github.com/eltonsantos/rails_toastify**.

## Licence

This gem is available as open-source under the terms of The MIT License (MIT).

Copyright (c) 2024 **Elton Santos**. See **MIT-LICENSE** for further details.
