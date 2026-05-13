# frozen_string_literal: true

require "test_helper"
require_relative "../dummy/config/environment"
require "capybara"

class RailsToastifyDummyTest < RailsToastifyTest
  def setup
    super
    @session = Capybara::Session.new(:rack_test, Rails.application)
  end

  def teardown
    @session.reset!
  end

  def test_dummy_app_renders_container_and_flash_payload
    @session.visit "/notice?message=%3Cstrong%3ESaved%3C%2Fstrong%3E"

    assert @session.has_css?("#rails-toastify-container.rails-toastify-container", visible: false)
    assert @session.has_css?("script[data-rails-toastify-messages]", visible: false)
    assert_includes @session.text, "RailsToastify Dummy"
    assert_includes @session.html, "\\u003cstrong\\u003eSaved\\u003c/strong\\u003e"
  end

  def test_dummy_app_serves_gem_assets
    @session.visit "/"

    assert_includes @session.html, "rails_toastify"
  end
end
