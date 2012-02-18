require 'httparty'

class Word
  include HTTParty

  attr_reader :query, :response

  def initialize query, response
    @query, @response  = query, response
  end

  def word
    query
  end

  def play
    if mp3?
      unless File.exists? filename
        command = "curl #{mp3_url} -silent > #{filename}"
        `#{command}`
      end
      `afplay #{filename}`
    end
    self
  end

  def mp3?
    !!mp3_url
  end

  def entry
    response["Entries"]["Entry"] rescue {}
  end

  def definition
    entry["Sense"].first["Subsense"].first["DEF"]["#text"] rescue ""
  end

  def inspect
    "<Word #{@query}: #{definition} mp3:#{mp3?}>"
  end

  def mp3_url
    path = entry["multimedia"].first["@href"]
    url = "https://api.pearson.com/longman/dictionary/#{path}?apikey=#{Word.api_key}"
  rescue
    nil
  end


  private

  def filename
    "tmp/#{query}.mp3"
  end

  class << self
    def play query
      search(query).play
    end

    def search query
      response = get(url(query)).parsed_response
      Word.new query, response
    end

    def api_key
      "e323f1656bccf0f1b166b2b52c57878b"
    end

    def url query
      #"&jsonp={jsonp_callback}"
      "https://api.pearson.com/longman/dictionary/entry.json?q=#{query}&apikey=#{api_key}"
    end


  end
end
