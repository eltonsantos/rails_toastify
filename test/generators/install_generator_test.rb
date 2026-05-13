# frozen_string_literal: true

require "test_helper"
require "rails/generators"
require "rails/generators/test_case"
require_relative "../../lib/generators/rails_toastify/install/install_generator"

class RailsToastifyInstallGeneratorTest < Rails::Generators::TestCase
  tests RailsToastify::Generators::InstallGenerator
  destination File.expand_path("../tmp/generators", __dir__)

  setup :prepare_destination

  def test_creates_modern_initializer
    run_generator

    assert_file "config/initializers/rails_toastify.rb", /configuration.position = 'top-right'/
    assert_file "config/initializers/rails_toastify.rb", /configuration.progress_color = nil/
    assert_file "config/initializers/rails_toastify.rb", /configuration.draggable = true/
    assert_file "config/initializers/rails_toastify.rb", /configuration.drag_threshold = 0.5/
  end
end
