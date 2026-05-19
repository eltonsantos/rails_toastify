# frozen_string_literal: true

Rails.application.routes.draw do
  root "toasts#index"
  get "/notice", to: "toasts#index", defaults: { flash_kind: "notice" }
  get "/alert", to: "toasts#index", defaults: { flash_kind: "alert" }
end
