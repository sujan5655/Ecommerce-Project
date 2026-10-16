import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
}
const { id } = useParams();
const [product, setProducts] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
