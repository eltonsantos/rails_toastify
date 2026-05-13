# RailsToastify

RailsToastify adds React Toastify-inspired notifications to Rails apps with a small Rails engine, asset-pipeline friendly CSS/JavaScript, and helpers for flash messages.

## Requirements

- Ruby >= 3.2
- Rails >= 7.1 and < 9.0
- A Rails asset pipeline that can serve engine assets, such as Propshaft or Sprockets

Rails 8 uses Propshaft by default, and RailsToastify ships browser-ready CSS and JavaScript files for direct asset-pipeline use.

## Installation

Add the gem to your Gemfile:

```ruby
gem "rails_toastify"
```

Install it:

```sh
bundle install
rails generate rails_toastify:install
```

The generator creates `config/initializers/rails_toastify.rb`:

```ruby
RailsToastify.setup do |configuration|
  configuration.position = "top-right" # top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
  configuration.notice_animation = "bounce" # bounce, slide, flip, zoom
  configuration.alert_animation = "slide" # bounce, slide, flip, zoom
  configuration.notice_duration = 3000
  configuration.alert_duration = 3000
  configuration.notice_theme = "light" # light, dark, colored
  configuration.alert_theme = "light" # light, dark, colored
  configuration.notice_type = "default" # default, success, warning, error, info
  configuration.alert_type = "error" # default, success, warning, error, info
  configuration.progress_color = nil
  configuration.notice_progress_color = nil
  configuration.alert_progress_color = nil
  configuration.draggable = true
  configuration.drag_threshold = 0.5
end
```

Older position values such as `toast-container-top-right` are still accepted and normalized.

## Usage

Add the assets to your layout:

```erb
<%= stylesheet_link_tag "rails_toastify", "data-turbo-track": "reload" %>
<%= javascript_include_tag "rails_toastify", "data-turbo-track": "reload" %>
```

Render the container and flash messages in the body:

```erb
<%= rails_toastify_container %>
<%= rails_toastify_messages %>
```

The helper renders flash payloads as escaped JSON. The JavaScript reads those payloads on `DOMContentLoaded`, `turbo:load`, and already-loaded pages without requiring inline app scripts.

You can also show a toast manually:

```js
RailsToastify.show("This is a message!", {
  theme: "light",
  type: "success",
  animation: "bounce",
  duration: 3000
});
```

## Progress Bar Colors

Configure a default progress color globally, per flash kind, or per toast:

```ruby
RailsToastify.setup do |configuration|
  configuration.progress_color = "#64748b"
  configuration.notice_progress_color = "#22c55e"
  configuration.alert_progress_color = "#ef4444"
end
```

```js
RailsToastify.show("Saved", { progressColor: "#22c55e" });
```

Color precedence is:

1. `RailsToastify.show(..., { progressColor: "..." })`
2. `notice_progress_color` or `alert_progress_color`
3. `progress_color`
4. The existing theme/type default

## Drag to Close

Drag dismissal is enabled by default:

```ruby
RailsToastify.setup do |configuration|
  configuration.draggable = true
  configuration.drag_threshold = 0.5
end
```

`drag_threshold` is the portion of the toast width required to dismiss the toast. You can override dragging per toast:

```js
RailsToastify.show("Pinned", { draggable: false });
```

Drag support uses pointer events, so mouse, touch, and pen input share the same behavior.

## Development

Run the full local verification suite:

```sh
bundle exec rake
```

Run the Rails compatibility matrix:

```sh
bundle exec appraisal install
bundle exec appraisal rake
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/eltonsantos/rails_toastify.

## License

This gem is available as open-source under the terms of the MIT License. See `MIT-LICENSE.md`.
