import { useState, useEffect } from 'react';
import { casosService } from '../services/casos';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

export default function CasosList() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCasos();
  }, []);

  const loadCasos = async () => {
    try {
      const data = await casosService.getAll();
      setCasos(data);
    } catch (err) {
      setError('Error al cargar casos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lista de Casos
      </Typography>
      
      {casos.map((caso) => (
        <Card key={caso.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{caso.titulo}</Typography>
            <Typography color="textSecondary">{caso.descripcion}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}