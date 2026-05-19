module RailsToastifyHelper
  def rails_toastify_container
    tag.div(
      "",
      id: "rails-toastify-container",
      class: "rails-toastify-container #{RailsToastify.configuration.position_class}",
      data: { rails_toastify_config: RailsToastify.configuration.to_h.to_json }
    )
  end

  def rails_toastify_script
    javascript_tag do
      <<-JS.html_safe
        window.RailsToastify && window.RailsToastify.init && window.RailsToastify.init();
      JS
    end
  end

  def rails_toastify_messages
    messages = rails_toastify_flash_messages
    return "".html_safe if messages.empty?

    tag.script(
      ERB::Util.html_escape(messages.to_json),
      type: "application/json",
      data: { rails_toastify_messages: true }
    )
  end

  private

  def rails_toastify_flash_messages
    config = RailsToastify.configuration.to_h
    [].tap do |messages|
      if flash[:notice]
        messages << {
          message: flash[:notice].to_s,
          options: {
            kind: "notice",
            animation: config[:notice_animation],
            duration: config[:notice_duration],
            theme: config[:notice_theme],
            type: config[:notice_type],
            progressColor: config[:notice_progress_color] || config[:progress_color]
          }.compact
        }
      end

      if flash[:alert]
        messages << {
          message: flash[:alert].to_s,
          options: {
            kind: "alert",
            animation: config[:alert_animation],
            duration: config[:alert_duration],
            theme: config[:alert_theme],
            type: config[:alert_type],
            progressColor: config[:alert_progress_color] || config[:progress_color]
          }.compact
        }
      end
    end
  end
end
