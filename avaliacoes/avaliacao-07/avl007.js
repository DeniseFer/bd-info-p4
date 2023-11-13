const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 1156;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('avx7.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});


//====================================================

// Crie a tabela CLIENTES, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS CLIENTES (COD_CLI INTEGER PRIMARY KEY AUTOINCREMENT, NOME_CLI TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
        } else {
            console.log('Tabela TB_CLIENTES criada com sucesso.');
        }
    }
);

//====================================================

// Crie a tabela NOTAS_FISCAIS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS NOTAS_FISCAIS (NUM_NF INTEGER PRIMARY KEY AUTOINCREMENT, VALOR FLOAT, COD_VEND INTEGER, COD_CLI INTEGER, FOREIGN KEY (COD_CLI) REFERENCES TB_CLIENTES (COD_CLI), FOREIGN KEY (COD_VEND) REFERENCES VENDEDORES (COD_VEND))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela NOTAS_FISCAIS criada com sucesso.');
        }
    }
);

//====================================================

// Crie a tabela VENDEDORES, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS VENDEDORES (COD_VEND INTEGER PRIMARY KEY AUTOINCREMENT, NOME_VEND TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela VENDEDORES:', err.message);
        } else {
            console.log('Tabela VENDEDORES criada com sucesso.');
        }
    }
);

//====================================================

// Crie a tabela ITENS_NOTAFISCAL, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS ITENS_NOTAFISCAL (ID_INF INTEGER PRIMARY KEY AUTOINCREMENT, NUM_NF INTEGER, UNIDADE INTEGER, COD_PRO INTEGER, QTD INTEGER, VALOR_ITEM REAL, FOREIGN KEY (NUM_NF) REFERENCES NOTAS_FISCAIS (NUM_NF), FOREIGN KEY (COD_PRO) REFERENCES PRODUTOS (COD_PRO))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela ITENS_NOTAFISCAL:', err.message);
        } else {
            console.log('Tabela ITENS_NOTAFISCAL criada com sucesso.');
        }
    }
);

//====================================================

// Crie a tabela PRODUTOS, se ainda não existir
db.run(
    'CREATE TABLE IF NOT EXISTS PRODUTOS (COD_PRO INTEGER PRIMARY KEY AUTOINCREMENT, DESCRICAO TEXT, PRECO_UNIT REAL)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela PRODUTOS:', err.message);
        } else {
            console.log('Tabela PRODUTOS criada com sucesso.');
        }
    }
);

//====================================================

// Rotas para operações CRUD TABELA CLIENTE

// Criar um CLIENTE
app.post('/cliente', (req, res) => {
    const { NOME_CLI } = req.body;
    db.run('INSERT INTO CLIENTES (NOME_CLI) VALUES (?, ?)', [NOME_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'cliente criado com sucesso' });
    });
});

// Obter todos os CLIENTES
app.get('/cliente', (req, res) => {
    db.all('SELECT * FROM CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ cliente: rows });
    });
});

// Obter um CLIENTE por ID
app.get('/cliente/:COD_CLI', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM CLIENTES WHERE COD_CLI = ?', [COD_CLI], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'CLIENTE não encontrado' });
            return;
        }
        res.json({ cliente: row });
    });
});

// Atualizar um Cliente por ID
app.put('/cliente/:COD_CLI', (req, res) => {
    const { COD_CLI } = req.params;
    const { NOME_CLI } = req.body;
    db.run('UPDATE CLIENTES SET NOME_CLI = ? WHERE COD_CLI = ?', [NOME_CLI, COD_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});

// Excluir um Cliente  por ID
app.delete('/cliente/:COD_CLI', (req, res) => {
    const { COD_CLI } = req.params;
    db.run('DELETE FROM CLIENTES WHERE COD_CLI = ?', [COD_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    });
});

//====================================================





//====================================================

// Rotas para operações CRUD TABELA VENDEDOR

// Criar um VENDEDOR
app.post('/vendedor', (req, res) => {
    const { NOME_VEND } = req.body;
    db.run('INSERT INTO VENDEDORES (NOME_VEND) VALUES (?)', [NOME_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});

// Obter todos os VENDEDORES
app.get('/vendedor', (req, res) => {
    db.all('SELECT * FROM VENDEDORES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedor: rows });
    });
});

// Obter um VENDEDOR por ID
app.get('/vendedor/:COD_VEND', (req, res) => {
    const { COD_VEND } = req.params;
    db.get('SELECT * FROM VENDEDORES WHERE COD_VEND = ?', [COD_VEND], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'VENDEDOR não encontrado' });
            return;
        }
        res.json({ vendedor: row });
    });
});

// Atualizar um VENDEDOR por ID
app.put('/vendedor/:COD_VEND', (req, res) => {
    const { COD_VEND } = req.params;
    const { NOME_VEND } = req.body;
    db.run('UPDATE VENDEDORES SET NOME_VEND = ? WHERE COD_VEND = ?', [NOME_VEND, COD_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'VENDEDOR atualizado com sucesso' });
    });
});

// Excluir um VENDEDOR  por ID
app.delete('/cliente/:COD_VEND', (req, res) => {
    const { COD_VEND } = req.params;
    db.run('DELETE FROM VENDEDORES WHERE COD_VEND = ?', [COD_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor excluído com sucesso' });
    });
});

//====================================================









//====================================================

// Rotas para operações CRUD TABELA PRODUTOS

// Criar um PRODUTO
app.post('/produto', (req, res) => {
    const { DESCRICAO , PRECO_UNIT } = req.body;
    db.run('INSERT INTO PRODUTOS (DESCRICAO, PRECO_UNIT) VALUES (?, ?)', [DESCRICAO, PRECO_UNIT], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Produto criado com sucesso' });
    });
});

// Obter todos os PRODUTO
app.get('/produto', (req, res) => {
    db.all('SELECT * FROM PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produto: rows });
    });
});

// Obter um PRODUTO por ID
app.get('/produto/:COD_PRO', (req, res) => {
    const { COD_PRO } = req.params;
    db.get('SELECT * FROM PRODUTOS WHERE COD_PRO = ?', [COD_PRO], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'PRODUTO não encontrado' });
            return;
        }
        res.json({ produto: row });
    });
});

// Atualizar um PRODUTO por ID
app.put('/produto/:COD_PRO', (req, res) => {
    const { COD_PRO } = req.params;
    const { DESCRICAO, PRECO_UNIT } = req.body;
    db.run('UPDATE PRODUTOS SET DESCRICAO = ?, PRECO_UNIT = ? WHERE COD_PRO = ?', [COD_PRO, DESCRICAO, PRECO_UNIT], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'PRODUTO atualizado com sucesso' });
    });
});

// Excluir um PRODUTO  por ID
app.delete('/produto/:COD_PRO', (req, res) => {
    const { COD_PRO } = req.params;
    db.run('DELETE FROM PRODUTOS WHERE COD_PRO = ?', [COD_PRO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto excluído com sucesso' });
    });
});

//====================================================







//====================================================

// Rotas para operações CRUD TABELA NOTAS FISCAIS

// Criar uma NOTA FISCAL
app.post('/notafiscal', (req, res) => {
    const { VALOR, COD_VEND, COD_CLI } = req.body;
    db.run('INSERT INTO NOTAS_FISCAIS (VALOR, COD_VEND, COD_CLI) VALUES (?, ?, ?)', [VALOR], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota Fiscal criado com sucesso' });
    });
});

// Obter todas as NOTAS FISCAIS
app.get('/notafiscal', (req, res) => {
    db.all('SELECT * FROM NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notafiscal: rows });
    });
});

// Obter uma NOTA FISCAL por ID
app.get('/notafiscal/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    db.get('SELECT * FROM NOTAS_FISCAIS WHERE NUM_NF = ?', [NUM_NF], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Nota fiscal não encontrada' });
            return;
        }
        res.json({ notafiscal: row });
    });
});

// Atualizar uma NOTA FISCAL por ID
app.put('/notafiscal/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    const { VALOR, COD_VEND, COD_CLI } = req.body;
    db.run('UPDATE NOTAS_FISCAIS SET VALOR = ?, SET COD_VEND = ?, SET COD_CLI = ? WHERE NUM_NF = ?', [NUM_NF, VALOR, COD_VEND, COD_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota Fiscal atualizado com sucesso' });
    });
});

// Excluir uma Nota Fiscal  por ID
app.delete('/notafiscal/:NUM_NF', (req, res) => {
    const { NUM_NF } = req.params;
    db.run('DELETE FROM NOTAS_FISCAIS WHERE NUM_NF = ?', [NUM_NF], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota Fiscal excluída com sucesso' });
    });
});

//====================================================




//====================================================

// Rotas para operações CRUD TABELA ITENS NOTAS FISCAIS

// Criar um ITEM NOTA FISCAL
app.post('/itemnotafiscal', (req, res) => {
    const { UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO  } = req.body;
    db.run('INSERT INTO ITENS_NOTAFISCAL (UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO ) VALUES (?, ?, ?, ?, ?)', [UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO ], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Item Nota Fiscal criado com sucesso' });
    });
});

// Obter todas os ITENS NOTAS FISCAIS
app.get('/itemnotafiscal', (req, res) => {
    db.all('SELECT * FROM ITENS_NOTAFISCAL', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itemnotafiscal: rows });
    });
});

// Obter um ITEM NOTA FISCAL por ID
app.get('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    db.get('SELECT * FROM ITENS_NOTAFISCAL WHERE ID_INF = ?', [ID_INF], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item Nota fiscal não encontrada' });
            return;
        }
        res.json({ itemnotafiscal: row });
    });
});

// Atualizar um ITEM NOTA FISCAL por ID
app.put('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    const { UNIDADE, QTD, VALOR_ITEM, NUM_NF, COD_PRO } = req.body;
    db.run('UPDATE ITENS_NOTAFISCAL SET VALOR_ITEM = ?, SET QTD = ?, SET UNIDADE = ?, SET NUM_NF = ?, SET COD_PRO = ? WHERE ID_INF = ?', [VALOR_ITEM, QTD, UNIDADE, ID_INF, NUM_NF, COD_PRO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal atualizado com sucesso' });
    });
});

// Excluir um ITEM NOTA FISCAL por ID
app.delete('/itemnotafiscal/:ID_INF', (req, res) => {
    const { ID_INF } = req.params;
    db.run('DELETE FROM ITENS_NOTAFISCAL WHERE ID_INF = ?', [ID_INF], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item Nota Fiscal excluída com sucesso' });
    });
});

//====================================================








// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});