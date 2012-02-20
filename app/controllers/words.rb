Pronounce.controllers :words do
  get :index do
    @word = Ldoce::Word.search(params[:word])

    if request.xhr?
      {mp3_url: @word.mp3_url,
       definition: @word.definition,
       word: @word.word
      }.to_json
    else
      render 'words/index'
    end
  end
end
