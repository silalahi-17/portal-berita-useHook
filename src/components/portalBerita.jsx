import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";

const NewsPortal = () => {
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchNews = async (searchTerm) => {
    if (searchTerm.length <= 2) {
      setArticles([]);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `/api/news?q=${searchTerm}`;

    try {
      const response = await axios.get(url);
      setArticles(response.data.articles || []);
    } catch (err) {
      console.log("Terjadi kesalahan", err);
      setError("Gagal mengambil berita");
    } finally {
      setLoading(false);
    }
  };

  // Debounce untuk input search
  const debouncedFetchNews = useCallback(debounce(fetchNews, 500), []);

  // Effect: saat keyword berubah
  useEffect(() => {
    if (keyword.length > 2) {
      debouncedFetchNews(keyword);
    } else {
      setArticles([]);
    }
  }, [keyword]);

  // Fetch semua berita pertama kali (jika ingin fetch tanpa keyword)
  useEffect(() => {
    fetchNews("");
  }, []);

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <a className="navbar-brand" href="#">
            Website Berita Terkini
          </a>
        </div>
      </nav>

      {/* Input Pencarian */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari berita..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value.trim())}
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
                  <small className="text-muted">
                    {article.source?.name} -{" "}
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </small>
                  <br />
                  <a
                    href={article.url}
                    className="btn btn-primary mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Baca Selengkapnya
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-muted text-center">
              Masukkan minimal 3 karakter untuk mencari berita.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default NewsPortal;
