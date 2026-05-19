# frozen_string_literal: true

require "test_helper"

class RailsToastifyHelperTest < RailsToastifyTest
  def test_container_renders_namespaced_dom_and_escaped_json_config
    RailsToastify.configuration.position = "toast-container-top-center"
    RailsToastify.configuration.progress_color = "#123456"

    html = RailsToastifyHelperContext.new.rails_toastify_container

    assert_includes html, 'id="rails-toastify-container"'
    assert_includes html, "rails-toastify-container-top-center"
    assert_includes html, "data-rails-toastify-config="
    assert_includes html, "&quot;progress_color&quot;:&quot;#123456&quot;"
  end

  def test_messages_render_safe_json_payload_without_inline_javascript
    html = RailsToastifyHelperContext.new(
      notice: '<script>window.evil = true</script>',
      alert: "Careful"
    ).rails_toastify_messages

    assert_includes html, 'type="application/json"'
    assert_includes html, "data-rails-toastify-messages"
    assert_includes html, "\\u003cscript\\u003ewindow.evil = true\\u003c/script\\u003e"
    refute_includes html, "RailsToastify.show"
  end

  def test_messages_are_empty_without_supported_flash
    assert_equal "", RailsToastifyHelperContext.new.rails_toastify_messages
  end

  def test_notice_and_alert_receive_kind_specific_options
    RailsToastify.configuration.notice_progress_color = "lime"
    RailsToastify.configuration.alert_progress_color = "red"

    html = RailsToastifyHelperContext.new(notice: "Saved", alert: "Failed").rails_toastify_messages

    assert_includes html, "&quot;kind&quot;:&quot;notice&quot;"
    assert_includes html, "&quot;progressColor&quot;:&quot;lime&quot;"
    assert_includes html, "&quot;kind&quot;:&quot;alert&quot;"
    assert_includes html, "&quot;progressColor&quot;:&quot;red&quot;"
  end
end
