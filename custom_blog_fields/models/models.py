# -*- coding: utf-8 -*-

from odoo import models, fields, api

class BlogPost(models.Model):
	_inherit = 'blog.post'

	image = fields.Binary('Blog Image')

	