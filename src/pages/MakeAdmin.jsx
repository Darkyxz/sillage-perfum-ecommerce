import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Shield, Key, User, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

const MakeAdmin = () => {
    const [secret, setSecret] = useState('');
    const [email, setEmail] = useState('perfumsillage@gmail.com');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleMakeAdmin = async (e) => {
        e.preventDefault();

        if (!secret.trim()) {
            toast({
                title: "Error",
                description: "Debes ingresar la clave secreta",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await apiClient.post('/users/make-admin', {
                secret: secret.trim(),
                email: email.trim()
            });

            if (response.success) {
                setResult({
                    success: true,
                    message: response.message,
                    data: response.data
                });

                toast({
                    title: "¡Éxito!",
                    description: response.message
                });
            } else {
                throw new Error(response.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error making admin:', error);

            setResult({
                success: false,
                message: error.message || 'Error al hacer admin'
            });

            toast({
                title: "Error",
                description: error.message || 'Error al hacer admin',
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <Card className="bg-background/80 border-border/50 backdrop-blur-sm">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">
                                Hacer Admin
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Herramienta temporal para asignar permisos de administrador
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleMakeAdmin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">
                                        Email del Usuario
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-background/50 border-border/50 text-foreground pl-10"
                                            placeholder="perfumsillage@gmail.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="secret" className="text-foreground">
                                        Clave Secreta
                                    </Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="secret"
                                            type="password"
                                            value={secret}
                                            onChange={(e) => setSecret(e.target.value)}
                                            className="bg-background/50 border-border/50 text-foreground pl-10"
                                            placeholder="Ingresa la clave secreta"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Contacta al desarrollador para obtener la clave secreta
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Hacer Admin
                                        </>
                                    )}
                                </Button>
                            </form>

                            {result && (
                                <div className={`p-4 rounded-lg border ${result.success
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : 'bg-red-50 border-red-200 text-red-800'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        {result.success ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {result.success ? '¡Éxito!' : 'Error'}
                                            </p>
                                            <p className="text-sm">{result.message}</p>
                                            {result.success && result.data && (
                                                <div className="mt-2 text-xs">
                                                    <p>Email: {result.data.email}</p>
                                                    <p>Rol: {result.data.role}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-muted/30 rounded-lg p-4">
                                <h3 className="font-medium text-foreground mb-2">
                                    ℹ️ Información:
                                </h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Esta herramienta es temporal y solo para desarrollo</li>
                                    <li>• El usuario debe estar registrado primero</li>
                                    <li>• Se requiere la clave secreta para seguridad</li>
                                    <li>• Una vez admin, puede acceder a /admin</li>
                                </ul>
                            </div>

                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.href = '/'}
                                >
                                    ← Volver al inicio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MakeAdmin;