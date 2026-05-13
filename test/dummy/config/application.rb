# frozen_string_literal: true

require "rails"
require "action_controller/railtie"
require "action_view/railtie"
require "propshaft"
require "propshaft/railtie"
require "rails_toastify"

module Dummy
  class Application < Rails::Application
    config.root = File.expand_path("..", __dir__)
    config.eager_load = false
    config.hosts.clear
    config.secret_key_base = "test-secret-key-base"
    config.session_store :cookie_store, key: "_rails_toastify_dummy_session"
    config.action_dispatch.show_exceptions = false
    config.consider_all_requests_local = true
  end
end
