# RailsToastify

**Rails Toastify** allows you to easily add notifications to your app. Please CONTRIBUTE.

The **Rails Toastify** gem is completely inspired by the [React Toastify](https://fkhadra.github.io/react-toastify/introduction/) lib and is specially made for those React developers who are migrating to Rails thanks to Hotwire or for any other reason, and who love using Toasts and wanted a gem that makes it as easy as it is in React. 🎉

To see the pure html, css and javascript that originated this gem, just access this **[codepen](https://codepen.io/eltin182/pen/QWXLaWj)** link.

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

This will create a file *config/initializers/rails_toastify.rb* where you can define what configuration you want to use:

```ruby
RailsToastify.setup do |configuration|
  configuration.position = 'toast-container-top-right'
  configuration.notice_animation = 'bounce' # bounce, slide, flip, zoom 
  configuration.alert_animation = 'slide' # bounce, slide, flip, zoom
  configuration.notice_duration = 3000
  configuration.alert_duration = 3000
  configuration.notice_theme = 'light' # light, dark
  configuration.alert_theme = 'light' # light, dark
  configuration.notice_type = 'default' # default, success, warning, error, info
  configuration.alert_type = 'error' # default, success, warning, error, info
end
```

## Usage

In your *application.html.erb* add in your header:

```ruby
<%= stylesheet_link_tag 'rails_toastify', media: 'all', 'data-turbolinks-track': 'reload' %>
<%= javascript_include_tag 'rails_toastify', 'data-turbo-track': 'reload' %>
```
And in your body:

```html
<%= rails_toastify_container %>
<%= rails_toastify_script %>
```
And call function `RailsToastify.show` any javascript or console:

```ruby
RailsToastify.show('This is a message!', { theme: 'light', type: 'default', animation: 'bounce', duration: 3000 });
```

To see notice or alert in a toast add this in application.html.erb:

```html 
<% if notice %>
  <script>
    RailsToastify.show('<%= notice %>',
      { theme: '<%= RailsToastify.configuration.notice_theme %>',
        type: '<%= RailsToastify.configuration.notice_type %>',
        animation: '<%= RailsToastify.configuration.notice_animation %>',
        duration: <%= RailsToastify.configuration.notice_duration %>
      })
  </script>
<% end %>

<% if alert %>
  <script>
    RailsToastify.show('<%= alert %>',
      { theme: '<%= RailsToastify.configuration.alert_theme %>',
        type: '<%= RailsToastify.configuration.alert_type %>',
        animation: '<%= RailsToastify.configuration.alert_animation %>',
        duration: <%= RailsToastify.configuration.alert_duration %>
      })
  </script>
<% end %>
```
** Note that toast can be configured for either notice type or alert type. Both types or just one of the types can be used.

## Next steps

- Add tests
- Add others positions (left, center, bottom)
- Add fade in and fade out animation
- In addition to the colors, allow the user to choose any color for the progress bar

## Requirements

- Ruby >= 2.6.0 (recommended 2.7+)  
- Rails >= 6.0 (compatible up to Rails 7)
  
## Contributing to Rails Toastify

Fork, fix, then send a pull request. Bug reports and pull requests are welcome on GitHub at **https://github.com/eltonsantos/rails_toastify**.

## License

This gem is available as open-source under the terms of The MIT License (MIT).

Copyright (c) 2024 **[Elton Santos](https://eltonmelosantos.com.br)**. See **MIT-LICENSE** for further details and see **CHANGELOG** to see what was changed.
