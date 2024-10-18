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
    attr_accessor :position, :animation, :duration, :theme, :type

    def initialize
      @position = 'toast-container-bottom-right'
      @animation = 'bounce'
      @duration = 5000
      @theme = 'light'
      @type = 'default'
    end

    def to_json
      {
        position: @position,
        animation: @animation,
        duration: @duration,
        theme: @theme,
        type: @type
      }.to_json
    end
  end

  class Error < StandardError; end
end
