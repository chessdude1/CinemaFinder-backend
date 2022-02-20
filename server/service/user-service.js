const UserModel = require('../models/user-model');
const TokenModel = require('../models/token-model')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const UserDtoPicture = require('../dtos/user-dto-picture');
const ApiError = require('../exceptions/api-error');


class UserService {
    async registration(email, password, favoriteFilms, fileName, name) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        if (!name) {
            throw ApiError.BadRequest(`Отсутствует имя пользователя`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        let favoriteFilmsDB = [];
        if (favoriteFilms) {
            favoriteFilmsDB = favoriteFilms
        }
        const user = await UserModel.create({ email, name: name, password: hashPassword, activationLink, favoriteFilms: favoriteFilmsDB, picture: fileName })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        if (user.picture) {
            const userDtoPicture = new UserDtoPicture(user)
            return { ...tokens, user: userDtoPicture }
        } else {
            return { ...tokens, user: userDto }
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        if (user.picture) {
            const userDtoPicture = new UserDtoPicture(user)
            return { ...tokens, user: userDtoPicture }
        } else {
            return { ...tokens, user: userDto }
        }

    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async getUser(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const token = await TokenModel.findOne({ refreshToken })
        const userId = token.user
        if (!userId) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findOne({ _id: userId })
        return user;
    }

    async updateUser(user) {
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        let findId = ''
        if (user.id) {
            findId = user.id
        } else {
            findId = user._id
        }
        const updatedUser = await UserModel.findByIdAndUpdate(findId, user, { new: true });
        if (!updatedUser) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return updatedUser
    }

    async updatePicture(id, picture) {
        const userBeforeChangedPicture = await UserModel.findOne({ _id: id });
        if (!userBeforeChangedPicture) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        await UserModel.updateOne({ _id: id }, { $set: { picture, } })
        const userWithUpdatedPicture = await UserModel.findOne({ _id: id });
        if (!userWithUpdatedPicture) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return userWithUpdatedPicture
    }

    async updatePassword(id, password) {
        const userBeforeChangePassword = await UserModel.findOne({ _id: id });
        if (!userBeforeChangePassword) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        await UserModel.updateOne({ _id: id }, { $set: { password: hashPassword } })
        const userWithUpdatedPassword = await UserModel.findOne({ _id: id });
        if (!userWithUpdatedPassword) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return userWithUpdatedPassword
    }
}

module.exports = new UserService();
