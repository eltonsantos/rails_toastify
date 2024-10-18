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

  def show_toast(message, options = {})
    javascript_tag do
      <<-JS.html_safe
        RailsToastify.show(#{message.to_json}, #{options.to_json});
      JS
    end
  end
end