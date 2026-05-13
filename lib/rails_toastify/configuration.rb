# frozen_string_literal: true

module RailsToastify
  class Configuration
    POSITIONS = %w[
      top-right
      top-left
      top-center
      bottom-right
      bottom-left
      bottom-center
    ].freeze
    ANIMATIONS = %w[bounce slide flip zoom].freeze
    THEMES = %w[light dark colored].freeze
    TYPES = %w[default success warning error info].freeze

    attr_accessor :position, :notice_animation, :alert_animation, :notice_duration, :alert_duration,
                  :notice_theme, :alert_theme, :notice_type, :alert_type, :progress_color,
                  :notice_progress_color, :alert_progress_color, :draggable, :drag_threshold

    def initialize
      @position = "top-right"
      @notice_animation = "bounce"
      @alert_animation = "zoom"
      @notice_duration = 3000
      @alert_duration = 3000
      @notice_theme = "light"
      @alert_theme = "light"
      @notice_type = "default"
      @alert_type = "error"
      @progress_color = nil
      @notice_progress_color = nil
      @alert_progress_color = nil
      @draggable = true
      @drag_threshold = 0.5
    end

    def position_name
      normalized = normalize_token(position, prefix: "toast-container-")
      normalized = normalize_token(normalized, prefix: "rails-toastify-container-")
      POSITIONS.include?(normalized) ? normalized : "top-right"
    end

    def position_class
      "rails-toastify-container-#{position_name}"
    end

    def to_h
      {
        position: position_name,
        notice_animation: normalize(notice_animation, ANIMATIONS, "bounce"),
        alert_animation: normalize(alert_animation, ANIMATIONS, "zoom"),
        notice_duration: positive_integer(notice_duration, 3000),
        alert_duration: positive_integer(alert_duration, 3000),
        notice_theme: normalize(notice_theme, THEMES, "light"),
        alert_theme: normalize(alert_theme, THEMES, "light"),
        notice_type: normalize(notice_type, TYPES, "default"),
        alert_type: normalize(alert_type, TYPES, "error"),
        progress_color: blank_to_nil(progress_color),
        notice_progress_color: blank_to_nil(notice_progress_color),
        alert_progress_color: blank_to_nil(alert_progress_color),
        draggable: !!draggable,
        drag_threshold: drag_threshold_value
      }
    end

    private

    def normalize(value, allowed, default)
      normalized = value.to_s.tr("_", "-")
      allowed.include?(normalized) ? normalized : default
    end

    def normalize_token(value, prefix:)
      value.to_s.tr("_", "-").delete_prefix(prefix)
    end

    def positive_integer(value, default)
      integer = Integer(value)
      integer.positive? ? integer : default
    rescue ArgumentError, TypeError
      default
    end

    def blank_to_nil(value)
      string = value.to_s.strip
      string.empty? ? nil : string
    end

    def drag_threshold_value
      threshold = Float(drag_threshold)
      return 0.5 unless threshold.positive?

      [threshold, 1.0].min
    rescue ArgumentError, TypeError
      0.5
    end
  end
end
