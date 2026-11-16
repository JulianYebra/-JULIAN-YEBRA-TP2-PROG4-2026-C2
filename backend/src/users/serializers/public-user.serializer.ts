export function serializePublicUser(usuario: any) {
  const usuarioPlano = usuario && typeof usuario.toObject === 'function'
    ? usuario.toObject()
    : { ...usuario };

  const { password, _id, __v, ...usuarioPublico } = usuarioPlano;

  return {
    ...usuarioPublico,
    id: usuario?._id ? usuario._id.toString() : usuario?.id ?? null,
  };
}
