RailsToastify.setup do |configuration|
  configuration.position = 'top-right' # top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
  configuration.notice_animation = 'bounce' # bounce, slide, flip, zoom
  configuration.alert_animation = 'slide' # bounce, slide, flip, zoom
  configuration.notice_duration = 3000
  configuration.alert_duration = 3000
  configuration.notice_theme = 'light' # light, dark, colored
  configuration.alert_theme = 'light' # light, dark, colored
  configuration.notice_type = 'default' # default, success, warning, error, info
  configuration.alert_type = 'error' # default, success, warning, error, info
  configuration.progress_color = nil # any CSS color, or nil to use the theme/type default
  configuration.notice_progress_color = nil # overrides progress_color for notice flash toasts
  configuration.alert_progress_color = nil # overrides progress_color for alert flash toasts
  configuration.draggable = true
  configuration.drag_threshold = 0.5 # portion of toast width required to dismiss by dragging
end
