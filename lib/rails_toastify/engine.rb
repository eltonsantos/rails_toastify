module RailsToastify
  class Engine < ::Rails::Engine
    initializer 'rails_toastify.assets.precompile' do |app|
      app.config.assets.precompile += %w(rails_toastify.js rails_toastify.css)
    end
  end
end