const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data');
const commissionsPath = path.join(dataPath, 'commissions.json');
const commissionDetailsPath = path.join(dataPath, 'commissionDetails.json');
const adminDataPath = path.join(dataPath, 'adminData.json');

const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading data from ${filePath}:`, error);
        throw new Error('Could not read data');
    }
};

const writeData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing data to ${filePath}:`, error);
        throw new Error('Could not write data');
    }
};

const getDayOfWeekCatalan = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';

    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return '';
    }
    const date = new Date(year, month - 1, day);
    const days = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];
    return days[date.getDay()];
};

app.get('/api/application-data', async (req, res) => {
    try {
        const commissions = await readData(commissionsPath);
        const commissionDetails = await readData(commissionDetailsPath);
        const adminData = await readData(adminDataPath);
        res.json({ commissions, commissionDetails, adminData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/commissions', async (req, res) => {
    try {
        const commissions = await readData(commissionsPath);
        res.json(commissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/commission-details', async (req, res) => {
    try {
        const commissionDetails = await readData(commissionDetailsPath);
        res.json(commissionDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/admin-data', async (req, res) => {
    try {
        const adminData = await readData(adminDataPath);
        res.json(adminData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminData = await readData(adminDataPath);
        const user = adminData.users.find(u => u.email === email && u.password === password);
        if (user) {
            const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
            res.json(sessionUser);
        } else {
            res.status(401).json({ message: 'Credencials invàlides.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/commission-detail/:actaId/:commissionDate', async (req, res) => {
    const { actaId, commissionDate } = req.params;
    try {
        const commissionDetails = await readData(commissionDetailsPath);
        const year = commissionDate.split('-').pop();
        let detail = commissionDetails.find(d => d.numActa === parseInt(actaId) && d.sessio.endsWith(`/${year}`));

        if (detail) {
            res.json(detail);
        } else {
            const commissions = await readData(commissionsPath);
            const commissionSummary = commissions.find(c => c.numActa === parseInt(actaId) && c.dataComissio.replace(/\//g, '-') === commissionDate);
            if (commissionSummary && commissionSummary.estat === 'Oberta') {
                const newDetail = {
                    numActa: parseInt(actaId),
                    sessio: commissionSummary.dataComissio,
                    dataActual: new Date().toLocaleDateString('ca-ES'),
                    hora: '9:00:00',
                    estat: 'Oberta',
                    mitja: 'Via telemàtica',
                    expedientsCount: 0,
                    expedients: [],
                };
                res.json(newDetail);
            } else {
                res.status(404).json({ message: 'Commission detail not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/commission-details', async (req, res) => {
    const updatedDetail = req.body;
    try {
        let commissionDetails = await readData(commissionDetailsPath);
        const updatedYear = updatedDetail.sessio.split('/')[2];
        let found = false;
        commissionDetails = commissionDetails.map(detail => {
            if (detail.numActa === updatedDetail.numActa && detail.sessio.endsWith(`/${updatedYear}`)) {
                found = true;
                return updatedDetail;
            }
            return detail;
        });
        if (!found) {
            commissionDetails.push(updatedDetail);
        }
        await writeData(commissionDetailsPath, commissionDetails);

        let commissions = await readData(commissionsPath);
        commissions = commissions.map(summary =>
            (summary.numActa === updatedDetail.numActa && summary.dataComissio.endsWith(`/${updatedYear}`)) ? {
                ...summary,
                numTemes: updatedDetail.expedients.length,
                dataComissio: updatedDetail.sessio,
                estat: updatedDetail.estat,
                diaSetmana: getDayOfWeekCatalan(updatedDetail.sessio),
            } : summary
        );
        await writeData(commissionsPath, commissions);
        res.json(updatedDetail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/commissions/:numActa/:dataComissio', async (req, res) => {
    const { numActa, dataComissio } = req.params;
    const { field, value } = req.body;
    try {
        let commissions = await readData(commissionsPath);
        let updatedCommission;
        commissions = commissions.map(c => {
            if (c.numActa == numActa && c.dataComissio.replace(/\//g, '-') === dataComissio) {
                updatedCommission = { ...c, [field]: value };
                if (field === 'avisEmail' && !value) {
                    updatedCommission.dataEmail = null;
                }
                return updatedCommission;
            }
            return c;
        });
        if (!updatedCommission) {
            return res.status(404).json({ message: "Commission not found" });
        }
        await writeData(commissionsPath, commissions);
        res.json(updatedCommission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/commissions/:numActa/:dataComissio/mark-as-sent', async (req, res) => {
    const { numActa, dataComissio } = req.params;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
    try {
        let commissions = await readData(commissionsPath);
        let updatedCommission;
        commissions = commissions.map(c => {
            if (c.numActa == numActa && c.dataComissio.replace(/\//g, '-') === dataComissio) {
                updatedCommission = { ...c, avisEmail: true, dataEmail: formattedDate };
                return updatedCommission;
            }
            return c;
        });
        if (!updatedCommission) {
            return res.status(404).json({ message: "Commission not found" });
        }
        await writeData(commissionsPath, commissions);
        res.json(updatedCommission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/commissions/generate-next-year', async (req, res) => {
    try {
        let commissions = await readData(commissionsPath);
        const commissionYears = commissions.map(c => parseInt(c.dataComissio.split('/')[2], 10));
        const lastYear = commissionYears.length > 0 ? Math.max(...commissionYears) : new Date().getFullYear();
        const nextYear = lastYear + 1;

        if (commissions.some(c => c.dataComissio.endsWith(`/${nextYear}`))) {
            return res.status(400).json({ message: `Les comissions per a l'any ${nextYear} ja existeixen.` });
        }

        const newCommissions = [];
        let actaCounter = 1;
        const date = new Date(nextYear, 0, 1);
        while (date.getDay() !== 3) {
            date.setDate(date.getDate() + 1);
        }
        while (date.getFullYear() === nextYear) {
            const newCommission = {
                numActa: actaCounter,
                numTemes: 0,
                diaSetmana: 'dimecres',
                dataComissio: date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'numeric', year: 'numeric' }),
                avisEmail: false,
                dataEmail: null,
                estat: 'Oberta'
            };
            newCommissions.push(newCommission);
            actaCounter++;
            date.setDate(date.getDate() + 14);
        }

        commissions = [...commissions, ...newCommissions].sort((a, b) => {
            const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
            const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            if (dateA.getTime() === dateB.getTime()) return a.numActa - b.numActa;
            return dateA.getTime() - dateB.getTime();
        });

        await writeData(commissionsPath, commissions);
        res.json(newCommissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/commissions', async (req, res) => {
    const { dataComissio, numActa } = req.body;
    try {
        let commissions = await readData(commissionsPath);
        const year = dataComissio.split('/')[2];
        const commissionsInYear = commissions.filter(c => c.dataComissio.endsWith(`/${year}`));

        if (commissionsInYear.some(c => c.numActa === numActa)) {
            return res.status(400).json({ message: `El número d'acta ${numActa} ja existeix per a l'any ${year}.` });
        }

        const newCommission = {
            numActa,
            dataComissio,
            diaSetmana: getDayOfWeekCatalan(dataComissio),
            numTemes: 0,
            estat: 'Oberta',
            avisEmail: false,
            dataEmail: null
        };

        commissions.push(newCommission);
        commissions.sort((a,b) => {
            const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
            const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            if(dateA.getTime() === dateB.getTime()) return a.numActa - b.numActa;
            return dateA.getTime() - dateB.getTime();
        });

        await writeData(commissionsPath, commissions);
        res.json(newCommission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/commissions/:originalNumActa/:originalDataComissio', async (req, res) => {
    const { originalNumActa, originalDataComissio } = req.params;
    const updatedData = req.body;
    try {
        let commissions = await readData(commissionsPath);
        const originalYear = originalDataComissio.split('-').pop();
        const updatedYear = updatedData.dataComissio.split('/')[2];
        const isChangingKey = parseInt(originalNumActa) !== updatedData.numActa || originalDataComissio.replace(/\//g, '-') !== updatedData.dataComissio;

        if (isChangingKey) {
            const conflict = commissions.find(c => c.numActa === updatedData.numActa && c.dataComissio.endsWith(`/${updatedYear}`));
            if (conflict) {
                return res.status(400).json({ message: `Ja existeix una comissió amb el número d'acta ${updatedData.numActa} per a l'any ${updatedYear}.` });
            }
        }

        let commissionToUpdate;
        commissions = commissions.map(c => {
            if (c.numActa == originalNumActa && c.dataComissio.replace(/\//g, '-') === originalDataComissio) {
                commissionToUpdate = {
                    ...c,
                    numActa: updatedData.numActa,
                    dataComissio: updatedData.dataComissio,
                    diaSetmana: getDayOfWeekCatalan(updatedData.dataComissio),
                };
                return commissionToUpdate;
            }
            return c;
        });

        if (!commissionToUpdate) {
            return res.status(404).json({ message: "No s'ha trobat la comissió per actualitzar." });
        }

        await writeData(commissionsPath, commissions);

        let commissionDetails = await readData(commissionDetailsPath);
        let detailToUpdate = commissionDetails.find(d => d.numActa == originalNumActa && d.sessio.endsWith(`/${originalYear}`));
        if (detailToUpdate) {
            detailToUpdate.numActa = updatedData.numActa;
            detailToUpdate.sessio = updatedData.dataComissio;
            await writeData(commissionDetailsPath, commissionDetails);
        }

        res.json(commissionToUpdate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/commissions/:numActa/:dataComissio', async (req, res) => {
    const { numActa, dataComissio } = req.params;
    try {
        let commissions = await readData(commissionsPath);
        let commissionDetails = await readData(commissionDetailsPath);
        const year = dataComissio.split('-').pop();

        const summaryToDelete = commissions.find(c => c.numActa == numActa && c.dataComissio.replace(/\//g, '-') === dataComissio);
        if (!summaryToDelete) {
            return res.status(404).json({ message: "Commission summary not found for deletion" });
        }

        const detailToDelete = commissionDetails.find(d => d.numActa == numActa && d.sessio.endsWith(`/${year}`)) || null;

        const payload = {
            summary: summaryToDelete,
            detail: detailToDelete,
        };

        commissions = commissions.filter(c => !(c.numActa == numActa && c.dataComissio.replace(/\//g, '-') === dataComissio));
        if (detailToDelete) {
            commissionDetails = commissionDetails.filter(d => !(d.numActa == numActa && d.sessio.endsWith(`/${year}`)));
        }

        await writeData(commissionsPath, commissions);
        await writeData(commissionDetailsPath, commissionDetails);

        res.json(payload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/commissions/restore', async (req, res) => {
    const { summary, detail } = req.body;
    try {
        let commissions = await readData(commissionsPath);
        let commissionDetails = await readData(commissionDetailsPath);

        commissions.push(summary);
        commissions.sort((a,b) => {
            const [dayA, monthA, yearA] = a.dataComissio.split('/').map(Number);
            const [dayB, monthB, yearB] = b.dataComissio.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            if(dateA.getTime() === dateB.getTime()) return a.numActa - b.numActa;
            return dateA.getTime() - dateB.getTime();
        });

        if (detail) {
            commissionDetails.push(detail);
        }

        await writeData(commissionsPath, commissions);
        await writeData(commissionDetailsPath, commissionDetails);

        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/admin/:list/:id', async (req, res) => {
    const { list, id } = req.params;
    const { name, email } = req.body;
    try {
        let adminData = await readData(adminDataPath);
        const adminList = adminData[list];
        adminData[list] = adminList.map(item =>
            item.id === id ? { ...item, name, email } : item
        );
        await writeData(adminDataPath, adminData);
        res.json({ id, name, email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/admin/:list/:id', async (req, res) => {
    const { list, id } = req.params;
    try {
        let adminData = await readData(adminDataPath);
        const adminList = adminData[list];
        const itemToDelete = adminList.find(item => item.id === id);
        if (!itemToDelete) {
            return res.status(404).json({ message: "Item not found for deletion" });
        }
        adminData[list] = adminList.filter(item => item.id !== id);
        await writeData(adminDataPath, adminData);
        res.json(itemToDelete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/:list/restore', async (req, res) => {
    const { list } = req.params;
    const item = req.body;
    try {
        let adminData = await readData(adminDataPath);
        adminData[list].push(item);
        await writeData(adminDataPath, adminData);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/:list', async (req, res) => {
    const { list } = req.params;
    const { name, email } = req.body;
    try {
        let adminData = await readData(adminDataPath);
        const newItem = {
            id: `new-${Date.now()}`,
            name,
            email,
        };
        adminData[list].push(newItem);
        await writeData(adminDataPath, adminData);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    try {
        let adminData = await readData(adminDataPath);
        adminData.users = adminData.users.map(user => {
            if (user.id === id) {
                const updatedUser = { ...user, name, email, role };
                if (password) {
                    updatedUser.password = password;
                }
                return updatedUser;
            }
            return user;
        });
        await writeData(adminDataPath, adminData);
        res.json({ id, name, email, role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let adminData = await readData(adminDataPath);
        const userToDelete = adminData.users.find(user => user.id === id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found for deletion" });
        }
        adminData.users = adminData.users.filter(user => user.id !== id);
        await writeData(adminDataPath, adminData);
        res.json(userToDelete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users/restore', async (req, res) => {
    const user = req.body;
    try {
        let adminData = await readData(adminDataPath);
        adminData.users.push(user);
        await writeData(adminDataPath, adminData);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        let adminData = await readData(adminDataPath);
        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            role,
            password,
        };
        adminData.users.push(newUser);
        await writeData(adminDataPath, adminData);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users/import', async (req, res) => {
    const importedUsers = req.body;
    try {
        let adminData = await readData(adminDataPath);
        const usersMap = new Map(adminData.users.map(u => [u.id, u]));

        importedUsers.forEach((importedUser) => {
            if (importedUser.id === 'user-master') return;

            const existingUser = usersMap.get(importedUser.id);
            if (existingUser) {
                usersMap.set(importedUser.id, { ...existingUser, name: importedUser.name, email: importedUser.email, role: importedUser.role || 'viewer' });
            } else {
                usersMap.set(importedUser.id, {
                    ...importedUser,
                    password: 'changeme123',
                    role: importedUser.role || 'viewer',
                });
            }
        });

        adminData.users = Array.from(usersMap.values());
        await writeData(adminDataPath, adminData);
        res.json(adminData.users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});