module RailsToastify
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      desc "Create RailsToastify config"

      def create_config_file
        copy_file "rails_toastify.rb", "config/initializers/rails_toastify.rb"
      end
    end
  end
end