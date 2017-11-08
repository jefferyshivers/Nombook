CarrierWave.configure do |config|
  if !Rails.env.test?
    
    config.fog_provider = 'fog/aws'
    config.fog_credentials = {
      provider: "AWS",
      aws_access_key_id: ENV["AWS_ACCESS_KEY_ID"],
      aws_secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"],
      region: 'us-east-2'      
    }

    if Rails.env.production?
      config.fog_directory  = ENV["S3_BUCKET_PRODUCTION"]
    elsif Rails.env.development?
      config.fog_directory  = ENV["S3_BUCKET_DEVELOPMENT"]      
    end

    config.fog_public = false
  end
end