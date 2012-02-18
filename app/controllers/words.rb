Pronounce.controllers :words do
  get :index do
    @word = Word.search(params[:word])

    render 'words/index'
  end
end

