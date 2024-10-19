module RailsToastifyHelper
  def rails_toastify_container
    content_tag :div, '', id: 'toast-container', class: "toast-container #{RailsToastify.configuration.position}"
  end

  def rails_toastify_script
    javascript_tag do
      <<-JS.html_safe
        document.addEventListener('DOMContentLoaded', function() {
          window.RailsToastify = {
            config: #{RailsToastify.configuration.to_h.to_json},
            show: function(message, options) {
              options = Object.assign({}, this.config, options || {});
              showToast(message, options);
            }
          };
        });
      JS
    end
  end

  def rails_toastify_messages
    output = []
    if flash[:notice]
      output << javascript_tag do
        <<-JS.html_safe
          document.addEventListener('DOMContentLoaded', function() {
            RailsToastify.show(#{flash[:notice].to_json}, {
              animation: '#{RailsToastify.configuration.notice_animation}',
              duration: #{RailsToastify.configuration.notice_duration},
              theme: '#{RailsToastify.configuration.notice_theme}',
              type: '#{RailsToastify.configuration.notice_type}'
            });
          });
        JS
      end
    end
    if flash[:alert]
      output << javascript_tag do
        <<-JS.html_safe
          document.addEventListener('DOMContentLoaded', function() {
            RailsToastify.show(#{flash[:alert].to_json}, {
              animation: '#{RailsToastify.configuration.alert_animation}',
              duration: #{RailsToastify.configuration.alert_duration},
              theme: '#{RailsToastify.configuration.alert_theme}',
              type: '#{RailsToastify.configuration.alert_type}'
            });
          });
        JS
      end
    end
    safe_join(output)
  end
end