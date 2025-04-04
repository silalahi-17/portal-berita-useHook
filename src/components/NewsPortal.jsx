import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

class NewsPortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      articles: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchNews("");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword && this.state.keyword.length > 2) {
      this.fetchNews(this.state.keyword);
    }
  }

  fetchNews = async (keyword) => {
    this.setState({ loading: true, error: null });
    const apiKey = import.meta.env.VITE_NEWS_API_KEY
    
    const url = keyword
    ? `https://newsapi.org/v2/everything?q=${keyword}&language=id&apiKey=${apiKey}`
    : `https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        this.setState({ articles: response.data.articles, loading: false });
    } catch (err) {
        console.log ("Terjado kesalahan", err)
      this.setState({ error: "Gagal mengambil berita", loading: false });
    }
  };

  handleInputChange = (e) => {
    this.setState({ keyword: e.target.value.trim() });
  };

  render() {
    const { keyword, articles, loading, error } = this.state;

    return (
      <div className="container mt-4">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <a className="navbar-brand" href="#">Website Berita Terkini</a>
          </div>
        </nav>

        {/* Input Pencarian */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Cari berita..."
          value={keyword}
          onChange={this.handleInputChange}
        />

        {/* Pesan Status */}
        {loading && <p className="text-center">🔄 Memuat berita...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Hasil Berita */}
        <div className="row">
          {articles.length > 0 ? (
            articles.slice(0, 20).map((article, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <img
                    src={article.urlToImage || "https://via.placeholder.com/400"}
                    className="card-img-top"
                    alt="Gambar Berita"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">{article.description || "Tidak ada deskripsi."}</p>
                    <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                      Baca Selengkapnya
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-muted text-center">Masukkan minimal 3 karakter untuk mencari berita.</p>
          )}
        </div>
      </div>
    );
  }
}

export default NewsPortal;
