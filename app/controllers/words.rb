Pronounce.controllers :words do
  get :index do
    @word = Word.search(params[:word])

    {mp3_url: @word.mp3_url,
     definition: @word.definition,
     word: @word.word
    }.to_json
  end
end
