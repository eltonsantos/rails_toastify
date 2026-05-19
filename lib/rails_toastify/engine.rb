require "rails"

module RailsToastify
  class Engine < ::Rails::Engine
    isolate_namespace RailsToastify

    initializer 'rails_toastify.assets.precompile' do |app|
      if app.config.respond_to?(:assets) && app.config.assets.respond_to?(:precompile)
        app.config.assets.precompile += %w(rails_toastify.js rails_toastify.css)
      end
    end

    initializer 'rails_toastify.helpers' do
      require_relative '../../app/helpers/rails_toastify_helper'
      ActiveSupport.on_load(:action_view) do
        include RailsToastifyHelper
      end
    end
  end
end
