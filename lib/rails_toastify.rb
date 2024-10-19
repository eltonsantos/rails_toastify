# frozen_string_literal: true

require_relative "rails_toastify/version"
require_relative "rails_toastify/engine"

module RailsToastify
  class << self
    attr_accessor :configuration
  end

  def self.setup
    self.configuration ||= Configuration.new
    yield(configuration)
  end

  class Configuration
    attr_accessor :position, :notice_animation, :alert_animation, :notice_duration, :alert_duration,
    :notice_theme, :alert_theme, :notice_type, :alert_type

    def initialize
      @position = 'toast-container-top-right'
      @notice_animation = 'bounce'
      @alert_animation = 'zoom'
      @notice_duration = 3000
      @alert_duration = 3000
      @notice_theme = 'light'
      @alert_theme = 'light'
      @notice_type = 'default'
      @alert_type = 'error'
    end

    def to_h
      {
        position: @position,
        notice_animation: @notice_animation,
        alert_animation: @alert_animation,
        notice_duration: @notice_duration,
        alert_duration: @alert_duration,
        notice_theme: @notice_theme,
        alert_theme: @alert_theme,
        notice_type: @notice_type,
        alert_type: @alert_type
      }
    end
  end

  class Error < StandardError; end
end
