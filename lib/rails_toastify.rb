# frozen_string_literal: true

require_relative "rails_toastify/version"
require_relative "rails_toastify/configuration"

module RailsToastify
  class << self
    attr_writer :configuration

    def configuration
      @configuration ||= Configuration.new
    end
  end

  def self.setup
    yield(configuration)
  end

  class Error < StandardError; end
end

require_relative "rails_toastify/engine"
