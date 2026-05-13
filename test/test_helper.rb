# frozen_string_literal: true

ENV["RAILS_ENV"] = "test"

require "bundler/setup"
require "minitest/autorun"
require "rails_toastify"
require "action_view"
require "active_support/testing/assertions"

require_relative "../app/helpers/rails_toastify_helper"

class RailsToastifyTest < Minitest::Test
  def setup
    RailsToastify.configuration = RailsToastify::Configuration.new
  end
end

class RailsToastifyHelperContext
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper
  include ActionView::Helpers::JavaScriptHelper
  include RailsToastifyHelper

  attr_reader :flash

  def initialize(flash = {})
    @flash = flash
  end
end
