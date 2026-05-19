# frozen_string_literal: true

require "test_helper"

class RailsToastifyConfigurationTest < RailsToastifyTest
  def test_defaults_are_modern_normalized_values
    config = RailsToastify.configuration

    assert_equal "top-right", config.to_h[:position]
    assert_equal "rails-toastify-container-top-right", config.position_class
    assert_equal "bounce", config.to_h[:notice_animation]
    assert_equal "zoom", config.to_h[:alert_animation]
    assert_equal true, config.to_h[:draggable]
    assert_equal 0.5, config.to_h[:drag_threshold]
  end

  def test_existing_position_class_values_are_normalized
    RailsToastify.configuration.position = "toast-container-bottom-left"

    assert_equal "bottom-left", RailsToastify.configuration.to_h[:position]
    assert_equal "rails-toastify-container-bottom-left", RailsToastify.configuration.position_class
  end

  def test_invalid_values_fall_back_to_defaults
    config = RailsToastify.configuration
    config.position = "middle"
    config.notice_animation = "spin"
    config.alert_duration = "nope"
    config.drag_threshold = 2

    values = config.to_h

    assert_equal "top-right", values[:position]
    assert_equal "bounce", values[:notice_animation]
    assert_equal 3000, values[:alert_duration]
    assert_equal 1.0, values[:drag_threshold]
  end

  def test_progress_colors_are_included_when_present
    config = RailsToastify.configuration
    config.progress_color = "#111"
    config.notice_progress_color = "green"
    config.alert_progress_color = "rgb(255, 0, 0)"

    assert_equal "#111", config.to_h[:progress_color]
    assert_equal "green", config.to_h[:notice_progress_color]
    assert_equal "rgb(255, 0, 0)", config.to_h[:alert_progress_color]
  end
end
