# frozen_string_literal: true

class ToastsController < ApplicationController
  def index
    flash_kind = params[:flash_kind]
    flash.now[flash_kind] = params[:message] if flash_kind
  end
end
