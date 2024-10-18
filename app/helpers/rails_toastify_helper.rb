module RailsToastifyHelper
  def rails_toastify_container
    content_tag :div, '', id: 'toast-container', class: "toast-container #{RailsToastify.configuration.position}"
  end

  def rails_toastify_script
    javascript_tag do
      <<-JS.html_safe
        document.addEventListener('DOMContentLoaded', function() {
          window.RailsToastify = {
            show: function(message, options) {
              var config = #{RailsToastify.configuration.to_json};
              options = options || {};
              showToast(message, Object.assign({}, config, options));
            }
          };
        });
      JS
    end
  end
end