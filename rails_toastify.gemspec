# frozen_string_literal: true

require_relative "lib/rails_toastify/version"

Gem::Specification.new do |spec|
  spec.name = "rails_toastify"
  spec.version = RailsToastify::VERSION
  spec.authors = ["Elton Santos"]
  spec.email = ["eltonaxl@hotmail.com"]
  spec.summary = "🎉 Rails Toastify allows you to add notifications to your app with ease."
  spec.description = "🎉 Rails Toastify allows you to add notifications to your app with ease. Pay Attention: this gem still is in development. Please CONTRIBUTE"
  spec.homepage = "https://github.com/eltonsantos/rails_toastify"
  spec.required_ruby_version = ">= 2.6.0"
  spec.license = "MIT"

  spec.metadata = {
    "homepage_uri" => spec.homepage,
    "source_code_uri" => "https://github.com/eltonsantos/rails_toastify",
    "changelog_uri" => "https://github.com/eltonsantos/rails_toastify/blob/master/CHANGELOG.md",
  }

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |f|
      (File.expand_path(f) == __FILE__) ||
        f.start_with?(*%w[bin/ test/ spec/ features/ .git appveyor Gemfile])
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Uncomment to register a new dependency of your gem
  # spec.add_dependency "example-gem", "~> 1.0"

  # For more information and examples about making a new gem, check out our
  # guide at: https://bundler.io/guides/creating_gem.html
end
