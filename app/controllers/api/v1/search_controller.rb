class Api::V1::SearchController < ApplicationController
  # skip_before_action :verify_authenticity_token, only: [:show]

  def show
    # query = params[:id].downcase
    query = "%#{params[:id]}%"

    users = User.where("lower(username) LIKE ?", query.downcase).
      order("case when lower(username) like '#{query.downcase}%' then 1 else 2 end, username ASC").take(10)

    render json: { 
      results: {
        users: users
      }
    }
  end
end