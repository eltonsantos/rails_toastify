module RailsToastify
  class Engine < ::Rails::Engine
    isolate_namespace RailsToastify

    initializer 'rails_toastify.assets.precompile' do |app|
      app.config.assets.precompile += %w(rails_toastify.js rails_toastify.css)
    end

    initializer 'rails_toastify.helpers' do
      ActiveSupport.on_load(:action_view) do
        include RailsToastifyHelper
      end
    end
  end
end