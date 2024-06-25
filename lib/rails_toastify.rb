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
    attr_accessor :framework

    def initialize
      @framework = :tailwind
    end
  end

  class Error < StandardError; end
end
