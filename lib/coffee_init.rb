module CoffeeInitializer
  def self.registered(app)
    app.use Rack::Coffee,
      :root => Padrino.root('/public'),
      :urls => '/javascripts'
      # :root: the directory above urls. Defaults to Dir.pwd.
      # :urls: the directories in which to look for coffeescripts. May specify a string or an array of strings. Defaults to /javascripts.
      # :static: Whether to serve any static assets found in your urls (via Rack::File). Defaults to true; Specify false to pass through to your app.
      # :cache: Sets a Cache-Control header if truthy, public if set to :public
      # :ttl: The default max-age value for the Cache-Control header. Defaults to 86400.
      # :nowrap: When true, disables the top-level function wrapper that CoffeeScript uses by default.

  end
end
