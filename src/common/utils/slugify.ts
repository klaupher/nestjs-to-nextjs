export function slugify(text: string) {
  return text
    .normalize('NFKD') // separa acentos de letras
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, '') // remove acentos (marcadores unicode)
    .replace(/[^a-z0-9]+/g, ' ') // troca tudo que não for letra por espaco
    .trim()
    .replace(/\s+/g, '-'); // espaço → hifen
}
